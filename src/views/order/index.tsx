import React, { useEffect, useState } from "react";
import {
  Page,
  Card,
  DataTable,
  Button,
  ButtonGroup,
  InlineStack,
  Checkbox,
  Box,
} from "@shopify/polaris";
import moment from "moment";
import { ImportOrder, Order } from "../../interface";
import EditOrderDialog from "./EditOrderDialog";
import { useNavigate } from "react-router-dom";
import ModalDeleteProduct from "../product/modal/modal-delete-product";
import { useModal } from "../../hook/useModal";
import { EModal } from "../../constants";
import ClientCtr from "../../ClientCtr";

const OrdersPage = () => {
  const { openModal, state: stateModal } = useModal();
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Array<ImportOrder>>([]);
  const [displayOrders, setDisplayOrders] = useState<Array<ImportOrder>>([]);
  const [order, setOrder] = useState<any>();
  const [page, setPage] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 1000;

  const navigate = useNavigate();

  const headings = [
    "",
    <div style={{ textAlign: "center" }}>ID</div>,
    <div style={{ textAlign: "center" }}>Mã đơn hàng</div>,
    <div style={{ textAlign: "left" }}>Ngày tạo</div>,
    <div style={{ textAlign: "left" }}>Nhà cung cấp</div>,
    <div style={{ textAlign: "left" }}>Trạng thái</div>,
    <div style={{ textAlign: "left" }}>Cập nhật lúc</div>,
  ];

  const formatToRowData = (data: ImportOrder[]) => {
    return data.map((item: ImportOrder, index: number) => [
      <Checkbox
        name=""
        value=""
        label=""
        labelHidden
        checked={
          selectedRows.find((rowId: any) => rowId === item.id) ? true : false
        }
        onChange={(v: boolean) => {
          !v
            ? setSelectedRows((prev: any) =>
                prev.filter((rowId: any) => rowId !== item.id)
              )
            : setSelectedRows((prev: any) => [...prev, item.id]);
        }}
      />,
      <div style={{ textAlign: "center" }}>{item.id}</div>,
      <div style={{ textAlign: "center" }}>{item.code}</div>,
      moment(item.createdAt).format("YYYY-MM-DD"),
      item.supplier.name,
      item.status.name,
      <div>{moment(item.updatedAt).format("hh:mm A / YYYY-MM-DD")}</div>,
    ]);
  };

  // Get all orders data
  const fetchData = async () => {
    await ClientCtr.getAllImportOrders()
      .then((response) => {
        const orderList = response?.data;
        setItems(orderList);
        setDisplayOrders(orderList.slice(0, itemsPerPage));
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [open, page, selectedRows]);

  const handleAddItem = () => {
    setOrder(undefined);
    setOpen(true);
  };

  const handleEditItem = () => {
    const item = items.find((item) => item.id === selectedRows[0]);
    setOrder(item);
    setOpen(true);
  };

  useEffect(() => {
    const rows: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".Polaris-DataTable__TableRow"
    );

    rows.forEach((row, index) => {
      row.style.cursor = "pointer";

      row.onclick = (e) => {
        if (
          (e.target as any)?.classList[0] === "Polaris-Checkbox__Input" ||
          (e.target as any)?.classList[0] === "Polaris-Checkbox__Backdrop"
        ) {
        } else {
          setSelectedRows((prev: number[]) =>
            prev.find((rowId: any) => rowId === items[index].id)
              ? prev.filter((rowId: any) => rowId !== Number(items[index].id))
              : [...prev, Number(items[index].id)]
          );
        }
      };

      row.ondblclick = (e) => {
        e.preventDefault();

        setOrder(items[index]);
        setOpen(true);
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedRows]);

  return (
    <Page
      backAction={{
        onAction: () => navigate("/"),
      }}
      title="Quản lý đơn nhập hàng"
      primaryAction={{
        content: "Tạo đơn hàng",
        onAction: () => handleAddItem(),
      }}
      fullWidth
    >
      <Box paddingBlockEnd={"400"}>
        <InlineStack gap={"400"}>
          <Button
            onClick={() => setSelectedRows(displayOrders.map((o) => o.id))}
            disabled={selectedRows.length === displayOrders.length}
          >
            Chọn tất cả
          </Button>
          <Button
            onClick={() => setSelectedRows([])}
            disabled={!selectedRows.length}
          >
            Bỏ chọn
          </Button>
        </InlineStack>
      </Box>
      <Card padding={"0"}>
        <DataTable
          hoverable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={headings}
          rows={formatToRowData(displayOrders)}
          truncate
        />
      </Card>

      {selectedRows.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "15px",
            background: "#fff",
            paddingBlock: 8,
            paddingInline: 12,
            borderRadius: 8,
            border: "1px solid #f1f1f1",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
          }}
        >
          <Button
            variant="primary"
            disabled={selectedRows.length > 1}
            onClick={handleEditItem}
          >
            Sửa đơn hàng
          </Button>
          <Button
            variant="primary"
            tone="critical"
            onClick={() => {
              openModal(EModal.MODAL_DELETE_PRODUCT, {
                data: { selectedRows, setSelectedRows },
              });
            }}
          >
            Xoá đơn hàng
          </Button>
        </div>
      )}
      {open && (
        <EditOrderDialog
          order={order}
          open={open}
          setOpen={setOpen}
          fetchData={fetchData}
          setSelectedRows={setSelectedRows}
        />
      )}
      <ModalDeleteProduct
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        type={"orders"}
      />
    </Page>
  );
};

export default OrdersPage;
