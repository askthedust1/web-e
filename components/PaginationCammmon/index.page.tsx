import React, { FC } from "react";
import ReactPaginate from "react-paginate";
import style from "./pagination-cammmon.module.scss";

interface Props {
  pageCount: number;
  itemsPerPage: string;
  onChangePage(page: number, itemsPerPage: string): void;
  currentPage?: number

}

const PaginatedItems: FC<Props> = ({
  onChangePage,
  itemsPerPage,
  pageCount,
  currentPage
}) => {
  const handlePageClick = async (event: { selected: number }) => {
    onChangePage(event.selected + 1, itemsPerPage);
  };

  return (
    <div className={style.paginationWrapper}>
      <ReactPaginate
        forcePage={currentPage}
        breakLabel="..."
        breakClassName={style.breakLabel}
        breakLinkClassName={style.breakLabelLink}
        nextLabel={false}
        onPageChange={handlePageClick}
        pageClassName={style.margin}
        pageRangeDisplayed={2}
        activeClassName={style.active}
        pageCount={pageCount}
        previousLabel={false}
        renderOnZeroPageCount={null}
        containerClassName={style.paginateWrapper}
        pageLinkClassName={style.pageLink}
      />
    </div>
  );
};
export default PaginatedItems;
