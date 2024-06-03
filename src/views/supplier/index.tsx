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
  TextField,
} from "@shopify/polaris";
import moment from "moment";
import { Supplier } from "../../interface";
import { useNavigate } from "react-router-dom";
import ModalDeleteProduct from "../product/modal/modal-delete-product";
import { useModal } from "../../hook/useModal";
import { EModal } from "../../constants";
import ClientCtr from "../../ClientCtr";
import EditSupplierDialog from './EditSupplierDialog';
import ModalDeleteSupplier from '../product/modal/modal-delete-supplier';

const SuppliersPage = () => {
  const { openModal, state: stateModal } = useModal();
  const [open, setOpen] = useState<boolean>(false);
  const [items, setItems] = useState<Array<Supplier>>([]);
  const [displayOrders, setDisplayOrders] = useState<Array<Supplier>>([]);
  const [supplier, setOrder] = useState<any>();
  const [page, setPage] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 1000;
  const [searchProduct, setSearchProduct] = useState<string>("");
  const navigate = useNavigate();

  const headings = [
    "",
    <div>ID</div>,
    <div>Tên nhà cung cấp</div>,
    <div style={{ textAlign: "left" }}>Email</div>,
    <div style={{ textAlign: "left" }}>Mã số thuế</div>,
    <div style={{ textAlign: "left" }}>Địa chỉ</div>,

  ];

  const formatToRowData = (data: Supplier[]) => {
    return data.map((item: Supplier, index: number) => [
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
      <div>{item.id}</div>,
      <div>{item.name}</div>,
      <div>{item.email}</div>,
      <div>{item.taxCode}</div>,
      <div>{item.address}</div>,
     
    ]);
  };

  // Get all suppliers data
  const fetchData = async () => {
    await ClientCtr.getAllSuppliers()
      .then((response) => {
        const supplierList = response?.data;
        setItems(supplierList);
        setDisplayOrders(supplierList.slice(0, itemsPerPage));
      })
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [open, page, selectedRows]);

  const handleSearch = async (key: string) => {
    if (key) {

      const response = await ClientCtr.getSuppliersByNameContaining(key);
      const newOrders = response?.data;
    
      setDisplayOrders(newOrders);
    } else {
      setDisplayOrders(items.slice(page * itemsPerPage, (page + 1) * itemsPerPage));
    }
  };

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
      title="Quản lý nhà cung cấp"
      primaryAction={{
        content: "Thêm nhà cung cấp",
        onAction: () => handleAddItem(),
      }}
      fullWidth
    >
      <Box paddingBlockEnd={"400"}> 
        <InlineStack gap={"400"} blockAlign="center">
            <TextField
              labelHidden
              label=""
              value={searchProduct}
              onChange={async (v) => {
                setSearchProduct(v);
                handleSearch(v);
              }}
              onClearButtonClick={async () => {
                setSearchProduct("");
                fetchData();
              }}
              placeholder="Tìm kiếm nhà cung cấp..."
              autoComplete=""
              clearButton
            />

            <Button
              onClick={() => setSelectedRows(displayOrders.map(row => row.id))}
              disabled={selectedRows.length === displayOrders.length}
              variant="secondary"
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
            Sửa nhà cung cấp
          </Button>
          <Button
            variant="primary"
            tone="critical"
            onClick={() => {
              openModal(EModal.MODAL_DELETE_SUPPLIER, {
                data: { selectedRows, setSelectedRows },
              });
            }}
          >
            Xoá nhà cung cấp
          </Button>
        </div>
      )}
      {open && (
        <EditSupplierDialog
          supplier={supplier}
          open={open}
          fetchData={fetchData}
          setSelectedRows={setSelectedRows} setOpen={setOpen}        />
      )}
      <ModalDeleteSupplier
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        type={"suppliers"}
      />
    </Page>
  );
};

export default SuppliersPage;
