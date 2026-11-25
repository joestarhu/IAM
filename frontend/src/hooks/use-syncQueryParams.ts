import { useEffect } from "react";
import { useSearchParams } from "react-router"
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUM } from "@/constants";

type QueryValue = string | number | boolean | null | undefined;
type QueryValues = Record<string, QueryValue>;

export function useSyncQueryParams(
    values: QueryValues,
    defaults: QueryValues = { pageNum: DEFAULT_PAGE_NUM, pageSize: DEFAULT_PAGE_SIZE },
) {
    const [, setSearchParams] = useSearchParams();
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(values)) {
        // 空值、空字符串和默认值不写入 URL
        if (value === null || value === undefined || value === "" || value === defaults[key]) {
            continue;
        }

        params.set(key, String(value));
    }

    // 用字符串作为依赖，避免对象每次重新创建导致重复执行
    const query = params.toString();

    useEffect(() => {
        setSearchParams(query, { replace: true });
    }, [query, setSearchParams]);
}
