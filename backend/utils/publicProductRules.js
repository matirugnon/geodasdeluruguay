function normalizeCandidate(value = '') {
    return value
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

const placeholderPatterns = [
    /\b(prueba|test|placeholder|demo|mock)\b/i,
    /^([a-z])\1{3,}$/i,
    /^(producto|item|collar|anillo|brazalete|pulsera|piedra|geoda|cristal)\s+[1-9]$/i,
];

function looksLikePlaceholderProduct(product = {}) {
    const title = normalizeCandidate(product.title);
    const slug = normalizeCandidate(product.slug);

    return [title, slug].some((candidate) =>
        candidate && placeholderPatterns.some((pattern) => pattern.test(candidate))
    );
}

function isPublicCatalogProduct(product = {}) {
    return product.visible === true && !looksLikePlaceholderProduct(product);
}

function enforceSafePublicVisibility(product = {}) {
    if (product && product.visible === true && looksLikePlaceholderProduct(product)) {
        product.visible = false;
    }

    return product;
}

module.exports = {
    looksLikePlaceholderProduct,
    isPublicCatalogProduct,
    enforceSafePublicVisibility,
};
