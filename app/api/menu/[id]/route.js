import { loadMenu, saveMenu } from "@/server/menuStore";
import { validateMenuItem } from "@/server/validateMenuItem";
import { jsonWithLog } from "@/server/apiLog";

function findItem(items, rawId) {
  const id = Number(rawId);
  if (Number.isNaN(id)) return null;
  return items.find((item) => item.id === id) ?? null;
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const items = await loadMenu();
    const item = findItem(items, id);
    if (!item) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Menu item not found.",
      });
    }
    return jsonWithLog(request, 200, { item });
  } catch (error) {
    console.error("Failed to load menu item:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading the menu item.",
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Request body must be valid JSON.",
    });
  }

  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Request body must be a JSON object.",
    });
  }

  try {
    const items = await loadMenu();
    const item = findItem(items, id);
    if (!item) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Menu item not found.",
      });
    }

    const merged = {
      name: body.name ?? item.name,
      category: body.category ?? item.category,
      unit: body.unit ?? item.unit,
      price: body.price ?? item.price,
      stock: body.stock ?? item.stock,
      availableToday: body.availableToday ?? item.availableToday,
    };
    const { isValid, errors, data } = validateMenuItem(merged);
    if (!isValid) {
      return jsonWithLog(request, 400, {
        status: "error",
        message: "Please fix the highlighted fields and try again.",
        errors,
      });
    }

    item.name = data.name;
    item.category = data.category;
    item.unit = data.unit;
    item.price = data.price;
    item.stock = data.stock;
    if (data.availableToday !== undefined) {
      item.availableToday = data.availableToday;
    }

    await saveMenu(items);
    return jsonWithLog(request, 200, { status: "success", item });
  } catch (error) {
    console.error("Failed to update menu item:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while updating the menu item.",
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const items = await loadMenu();
    const item = findItem(items, id);
    if (!item) {
      return jsonWithLog(request, 404, {
        status: "error",
        message: "Menu item not found.",
      });
    }

    const remaining = items.filter((existing) => existing.id !== item.id);
    await saveMenu(remaining);
    return jsonWithLog(request, 200, { status: "success", deleted: item });
  } catch (error) {
    console.error("Failed to delete menu item:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while deleting the menu item.",
    });
  }
}
