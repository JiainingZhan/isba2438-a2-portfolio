import { loadMenu, saveMenu } from "@/server/menuStore";
import { validateMenuItem } from "@/server/validateMenuItem";
import { jsonWithLog } from "@/server/apiLog";

export async function GET(request) {
  try {
    const items = await loadMenu();
    return jsonWithLog(request, 200, { items });
  } catch (error) {
    console.error("Failed to load menu:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while loading the menu.",
    });
  }
}

export async function POST(request) {
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

  const { isValid, errors, data } = validateMenuItem({
    name: body.name,
    category: body.category,
    unit: body.unit,
    price: body.price,
    stock: body.stock,
    availableToday: body.availableToday,
  });

  if (!isValid) {
    return jsonWithLog(request, 400, {
      status: "error",
      message: "Please fix the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const items = await loadMenu();
    const nextId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    const entry = {
      id: nextId,
      name: data.name,
      category: data.category,
      unit: data.unit,
      price: data.price,
      stock: data.stock,
      availableToday: data.availableToday ?? false,
    };
    items.push(entry);
    await saveMenu(items);
    return jsonWithLog(request, 201, { status: "success", item: entry });
  } catch (error) {
    console.error("Failed to save menu item:", error);
    return jsonWithLog(request, 500, {
      status: "error",
      message: "Something went wrong while saving the menu item.",
    });
  }
}
