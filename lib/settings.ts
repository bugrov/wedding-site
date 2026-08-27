// Placeholder for the future SiteSettings.basePrice (admin-editable, step 6
// per plan) — landing page shows this fallback until that setting exists in
// the DB/admin UI. One flat price, not "от {price}" — deliberately not
// scaling with the chosen blocks (see feedback: "не будем увеличивать
// стоимость исходя из блоков, это лишнее").
export const BASE_PRICE_FALLBACK = 2000;
