
export type Lang = "en" | "uk" | "ru"
export const adminStrings: Record<Lang, Record<string,string>> = {
  en: { title: "Admin panel", create: "Create user", copy: "Copy", save: "Save", delete: "Delete user", chat: "Chat with user", switch: "Language", list: "Users", note: "Admin note name", login: "Login", password: "Password", role: "Role", photo: "Photo", details: "Details" },
  uk: { title: "Адмін-панель", create: "Створити користувача", copy: "Копіювати", save: "Зберегти", delete: "Видалити користувача", chat: "Чат з користувачем", switch: "Мова", list: "Користувачі", note: "Нік для адміна", login: "Логін", password: "Пароль", role: "Роль", photo: "Фото", details: "Деталі" },
  ru: { title: "Админ-панель", create: "Создать пользователя", copy: "Копировать", save: "Сохранить", delete: "Удалить пользователя", chat: "Чат с пользователем", switch: "Язык", list: "Пользователи", note: "Ник для админа", login: "Логин", password: "Пароль", role: "Роль", photo: "Фото", details: "Детали" }
}
