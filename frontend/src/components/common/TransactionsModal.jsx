import { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import PaginationBar from "./PaginationBar";
import TransactionList from "./TransactionList";

/**
 * TransactionsModal (dùng chung Company/Driver/Admin...)
 *
 * Props:
 * - show: boolean
 * - onHide: () => void
 * - title?: string (default "All Transactions")
 * - perspectiveWalletId?: string (để tô màu +/-)
 * - fetchPage: (page: number, size: number) => Promise<PageResultLike>
 *     PageResultLike: { items, totalItems, totalPages, page, size }
 * - pageSizeOptions?: number[] (default [10,20,50])
 */
export default function TransactionsModal({
  show,
  onHide,
  title = "All Transactions",
  perspectiveWalletId,
  fetchPage,
  pageSizeOptions = [10, 20, 50],
}) {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSizeOptions[0]);
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 0,
    page: 1,
    size: pageSizeOptions[0],
  });

  const loadData = async () => {
    if (!show || !fetchPage) return;
    setLoading(true);
    try {
      const res = await fetchPage(page, size);
      setData({
        items: res?.items || [],
        totalItems: res?.totalItems ?? 0,
        totalPages: res?.totalPages ?? 0,
        page: res?.page ?? page,
        size: res?.size ?? size,
      });
    } catch (e) {
      toast.error(e?.message || "Cannot load transactions");
    } finally {
      setLoading(false);
    }
  };

  // mở modal / đổi page / size → nạp trang
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, page, size]);

  // đóng modal → reset phân trang
  useEffect(() => {
    if (!show) {
      setPage(1);
      setSize(pageSizeOptions[0]);
      setData((d) => ({ ...d, items: [] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="py-4 text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <TransactionList
              transactions={data.items}
              perspectiveWalletId={perspectiveWalletId}
              emptyText="No transactions"
              // không truyền limit -> hiển thị hết items của trang hiện tại
            />

            <div className="mt-3">
              <PaginationBar
                page={page}
                size={size}
                totalItems={data.totalItems}
                totalPages={data.totalPages}
                onPageChange={setPage}
                onSizeChange={setSize}
                sizeOptions={pageSizeOptions}
              />
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}
