export async function getUserPlan(userId?: string) {
    return {
        isPro: true,
        planName: "PRO" as const,
    };
}