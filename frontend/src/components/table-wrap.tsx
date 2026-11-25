import { type ReactNode } from "react"
import { useTranslation, Trans } from "react-i18next"

import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, } from "@/components/ui/pagination"
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem, } from "@/components/ui/select"
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableFooter, } from "@/components/ui/table"

import { EmptyTableContent } from "./empty-wrap"
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants"
import { cn } from "cn"


export interface TableListHeaderProps {
    label: string
    class?: string
}

export interface TableListProps {
    headers: TableListHeaderProps[]
    rows: unknown[]
    children: ReactNode
    pageNum: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (value: number) => void
    onSizeChange: (value: number) => void
}

export function TableList({
    headers,
    rows,
    children,
    pageNum,
    pageSize,
    totalItems,
    onPageChange,
    onSizeChange,
}: TableListProps
) {
    return (
        <Table>
            <TableHeader className="bg-muted">
                <TableRow>
                    {
                        headers.map(head => (
                            <TableHead key={head.label} className={cn(head.class, "text-xs text-muted-foreground")}>{head.label}</TableHead>
                        ))
                    }
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={headers.length}>
                            <EmptyTableContent />
                        </TableCell>
                    </TableRow>
                )}
                {rows.length > 0 && children}
            </TableBody>

            <TableFooter className="bg-transparent">
                <TableRow>
                    <TableCell colSpan={headers.length}>
                        <div className="flex w-full items-center">
                            <TablePagination pageNum={pageNum} pageSize={pageSize} totalItems={totalItems} onPageChange={onPageChange} onSizeChange={onSizeChange} />
                        </div>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}



export function TablePagination({
    pageNum = DEFAULT_PAGE_NUM,
    pageSize = DEFAULT_PAGE_SIZE,
    totalItems = 0,
    onPageChange,
    onSizeChange,
}: {
    pageNum: number,
    pageSize: number,
    totalItems: number,
    onPageChange: (value: number) => void,
    onSizeChange: (value: number) => void,
}) {
    const { t } = useTranslation()
    const msg = {
        rowsPerPage: t("common:rowsPerPage")
    }

    // 确保有效的每页数量
    if (!PAGE_SIZE_OPTIONS.some(
        (item) => item.value === pageSize
    )) {
        onSizeChange(DEFAULT_PAGE_SIZE)
    }

    // 确保有效的页数(1~max)
    const pageTotal = Math.max(Math.ceil(totalItems / Math.max(pageSize, 1)), 1)
    if (pageNum < DEFAULT_PAGE_NUM) {
        onPageChange(DEFAULT_PAGE_NUM)
    }
    if (pageNum > pageTotal) {
        onPageChange(pageTotal)
    }

    function prevPage() {
        const value = pageNum - 1
        if (value >= 1) {
            onPageChange(value)
        }
    }

    function nextPage() {
        const value = pageNum + 1
        if (value <= pageTotal) {
            onPageChange(value)
        }
    }


    return (
        <div className="flex items-center justify-between gap-2.5 w-full">
            <div className="flex text-xs gap-1">
                <span className="text-muted-foreground">
                    <Trans
                        ns="common"
                        i18nKey="totalItems"
                        count={totalItems}
                        components={{
                            span: <span className="text-accent-foreground tabular-nums" />
                        }}
                    />
                </span>
            </div>


            <div className="flex gap-2.5">
                <div className="flex items-center gap-0.5">
                    <span className="text-muted-foreground text-xs">{msg.rowsPerPage}</span>
                    <Select items={PAGE_SIZE_OPTIONS} value={pageSize} onValueChange={(value) => {
                        if (value !== null) {
                            onSizeChange(value)
                        }
                    }}>
                        <SelectTrigger className={'w-auto h-5! border-0 ring-0 text-muted-foreground! text-xs'}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem >
                            <PaginationPrevious size={'icon'} text="" onClick={() => prevPage()} />
                        </PaginationItem>
                        <PaginationItem className="text-xs">
                            <span className="text-accent-foreground">{pageNum}</span>
                            <span className="text-muted-foreground"> of {pageTotal}</span>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext size={'icon'} text="" onClick={() => nextPage()} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

