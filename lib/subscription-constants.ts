export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
}

export const PLAN_LIMITS = {
    FREE: {
        maxBooks: 2,
    },
    PRO: {
        maxBooks: 100,
    },
};


