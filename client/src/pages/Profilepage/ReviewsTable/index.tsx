/* eslint-disable react/jsx-key */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import { getCategories } from "@app/api/reviews";
import DownIcon from "@app/assets/icons/DownIcon";
import SearchIcon from "@app/assets/icons/SearchIcon";
import UpIcon from "@app/assets/icons/UpIcon";
import Loader from "@app/components/Loader";
import TableActions from "@app/components/TableActions";
import useError from "@app/hooks/useError";
import { Routes } from "@app/router/rooter";
import { CategoriesData, Category, Review } from "@app/types/types";
import { classNames } from "@app/utils";
import { useQuery } from "@tanstack/react-query";

interface ReviewsTableProps {
  tableData: Review[];
  isAdmin: boolean;
  isOwnPage: boolean;
}

const ReviewsTable = (props: ReviewsTableProps) => {
  const { tableData, isAdmin, isOwnPage } = props;
  const { t } = useTranslation();
  const { onError } = useError();
  const [categories, setCategories] = useState<Category[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useQuery<CategoriesData>(["categories"], getCategories, {
      onError,
      retry: false,
    });

  const columns: Column<any>[] = useMemo(() => {
    const baseColumns = [
      {
        Header: t("ProfileTable.id"),
        accessor: "id",
      },
      {
        Header: t("ProfileTable.reviewName"),
        accessor: "workName",
        sortType: "basic",
        Cell: ({ row }: { row: any }) => (
          <Link
            className="underline"
            to={`${Routes.reviewpage}/${row.values.id}`}
          >
            {row.values.workName}
          </Link>
        ),
      },
      {
        Header: t("ProfileTable.category"),
        accessor: "category",
        sortType: "basic",
      },
      {
        Header: t("ProfileTable.createdDate"),
        accessor: "createdTime",
        sortType: "basic",
      },
      {
        Header: t("ProfileTable.authorGrade"),
        accessor: "reviewGrade",
        sortType: "basic",
      },
      {
        Header: t("ProfileTable.rating"),
        accessor: "ratings",
        sortType: "basic",
      },
      {
        Header: t("ProfileTable.likes"),
        accessor: "likes",
        sortType: "basic",
      },
    ];

    if (isOwnPage || isAdmin) {
      baseColumns.push({
        Header: t("ProfileTable.actions"),
        accessor: "actions",
        sortType: "basic",
        Cell: ({ row }: { row: any }) => <TableActions review={row.original} />,
      });
    }

    return baseColumns;
  }, [t]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    canNextPage,
    canPreviousPage,
    setPageSize,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const { pageIndex } = state;

  useEffect(() => {
    if (pageNumber > pageCount || pageNumber < 1) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [pageNumber, pageCount]);

  useEffect(() => {
    categoriesData && setCategories(categoriesData.categories);
  }, [categoriesData]);

  const handlePageInputChange = (e: any) => {
    const inputPage = e.target.value;
    setPageNumber(inputPage);
  };

  const handleGoToPage = () => {
    if (pageNumber <= pageCount && pageNumber >= 1) {
      console.log("go to page");
      gotoPage(pageNumber - 1);
    }
  };

  return isCategoriesLoading ? (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader />
    </div>
  ) : (
    <>
      <div className="flex justify-start">
        <div className="relative mr-6">
          <input
            type="text"
            placeholder={t("ProfileTable.search")}
            value={state.globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-[44px] w-[628px] rounded-[6px] border border-solid border-[#DEDEDE] bg-[transparent] px-4 py-2 pr-10 placeholder-[#2C2C2C] outline-none focus:ring-0 dark:border-[#2C2C2C] dark:text-[#9D9D9D] dark:placeholder-[#9D9D9D]"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <SearchIcon size={24} />
          </div>
        </div>
        <div className="h-[44px] w-[302px]">
          <select
            name="category"
            className="block h-full w-full rounded-md border-gray-300 bg-[transparent] px-3 text-[#2C2C2C] shadow-sm dark:border-[#2C2C2C] dark:border-[#2C2C2C] dark:text-[#9D9D9D] dark:placeholder-[#9D9D9D]"
            value={state.globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          >
            <option value="">{t("Review.category")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table {...getTableProps()} className="mt-8 min-w-full table-fixed">
        <thead className="bg-gray-10">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-5 text-base font-medium text-[#636060]"
                >
                  <div className="flex">
                    {column.render("Header")}
                    {column.id === "selection" && column.render("Summary")}
                    {typeof column.Header === "string" && (
                      <span className="ml-1 self-center">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <DownIcon size={14} />
                          ) : (
                            <UpIcon size={14} />
                          )
                        ) : (
                          <span className="flex">
                            <DownIcon size={14} />
                            <UpIcon size={14} />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="divide-y bg-white shadow-tableRowShadow dark:divide-[#1B1B1B]"
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="rounded-[8px] bg-white text-left dark:bg-[#2C2C2C]"
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="whitespace-nowrap px-6 py-5 text-base dark:text-white"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination mt-4 flex items-center justify-start space-x-4">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className={`${
            !canPreviousPage
              ? "cursor-not-allowed bg-gray-300"
              : "bg-gradientBtnBlue"
          } rounded px-4 py-2 text-white`}
        >
          {"<<"}
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className={`${
            !canPreviousPage
              ? "cursor-not-allowed bg-gray-300"
              : "bg-gradientBtnBlue"
          } rounded px-4 py-2 text-white`}
        >
          {"<"}
        </button>
        <span className="text-lg font-bold">
          Page {pageIndex + 1} of {pageCount}
        </span>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className={`${
            !canNextPage
              ? "cursor-not-allowed bg-gray-300"
              : "bg-gradientBtnBlue"
          } rounded px-4 py-2 text-white`}
        >
          {">"}
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          className={`${
            !canNextPage
              ? "cursor-not-allowed bg-gray-300"
              : "bg-gradientBtnBlue"
          } rounded px-4 py-2 text-white`}
        >
          {">>"}
        </button>

        <div className="flex items-center">
          <span className="mr-2">Go to Page:</span>
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInputChange}
            className="w-16 rounded border border-gray-300 px-2 py-1"
          />
          <button
            disabled={isButtonDisabled}
            onClick={handleGoToPage}
            className={classNames(
              "ml-2 flex h-[40px] w-[50px] items-center justify-center rounded-md bg-gradientBtnBlue px-2 py-1.5 text-base font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2",
              isButtonDisabled
                ? "cursor-not-allowed bg-gray-300 hover:bg-gray-400"
                : null
            )}
          >
            Go
          </button>
        </div>
      </div>
    </>
  );
};

export default ReviewsTable;