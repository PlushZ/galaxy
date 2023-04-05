import { fetcher } from "@/schema/fetcher";

const getHistories = fetcher.path("/api/histories").method("get").create();

export interface ItemSizeSummary {
    id: string;
    name: string;
    size: number;
    deleted: boolean;
}

const historySizeSummaryFields = "id,name,size,deleted";

export async function getAllHistoriesSizeSummary() {
    const activeHistoriesResponse = await getHistories({ keys: historySizeSummaryFields, deleted: false });
    const activeHistories = activeHistoriesResponse.data as ItemSizeSummary[];
    const deletedHistoriesResponse = await getHistories({ keys: historySizeSummaryFields, deleted: true });
    const deletedHistories = deletedHistoriesResponse.data as ItemSizeSummary[];
    return [...activeHistories, ...deletedHistories];
}
