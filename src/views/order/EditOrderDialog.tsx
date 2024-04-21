import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  TextField,
  Select,
  DataTable,
  FormLayout,
  TableData,
  ButtonGroup,
  Text,
  Box,
  Thumbnail,
  InlineStack,
  BlockStack,
  Grid,
  Badge,
} from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import moment from "moment";
import axios from "axios";
import AddOrderProductDialog from "./AddOrderProductDialog";
import { Employee, ImportOrder, ImportOrderProduct, Status, Supplier } from "../../interface";
import ClientCtr from "../../ClientCtr";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: ImportOrder;
  fetchData: () => Promise<void>;
  setSelectedRows: Function;
}

const EditOrderDialog: React.FC<Props> = ({
  open,
  setOpen,
  order,
  fetchData,
  setSelectedRows,
}) => {
  const [showErr, setShowErr] = useState<boolean>(false);
  const [listSupplier, setListSupplier] = useState<Supplier[]>([]);
  const [listEmployee, setListEmployee] = useState<Employee[]>([])
  const [listStatus, setListStatus] = useState<Status[]>([])
  const [payment, setPayment] = useState<number>(0);
  const [addProductDialog, setAddProductDialog] = useState<boolean>(false);
  const [orderProduct, setOrderProduct] = useState<ImportOrderProduct>();
  const [importOrderProducts, setImportOrderProducts] = useState<ImportOrderProduct[]>(order?.importOrderProducts || [])
  const [code, setCode] = useState<string>(order?.code)
  const [note, setNote] = useState<string>(order?.note || '')
  const [orderData, setOrderData] = useState<ImportOrder>(
    order || {
      status: false,
      supplier: { id: 0, name: "" },
      importOrderProducts: [],
      note: "",
      code: "",
      payment: 0,
      employee: { id: 0, name: "" },
      updatedAt: moment().format("YYYY-MM-DD"),
      createdAt: moment().format("YYYY-MM-DD"),
    }
  );
  console.log(orderData)
  const [supplier, setSupplier] = useState<Supplier>(
    order?.supplier
  );
  const [status, setStatus] = useState<Status>(
    order?.status 
  );
  const [employee, setEmployee] = useState<Employee>(order?.employee)

  const fetchImportOrderData = async (id: number) => {
    await ClientCtr.getImportOrder(id).then((response) => {
      setOrderData(response?.data)
    }).catch((error) => {alert(error.message)});
  }


  const fetchSupplierData = async () => {
    await ClientCtr.getAllSuppliers().then(response => {
      setListSupplier(response?.data)
    })
  };
  const fetchEmployeeData = async () => {
    await ClientCtr.getAllEmployees().then(response => {
      setListEmployee(response?.data)
    })
  };
  const fetchStatusData = async () => {
    await ClientCtr.getAllStatuses().then(response => {
      setListStatus(response?.data)
    })
  };
  useEffect(() => {
    // if (order) {
    //   fetchImportOrderData(order.id)
    // }
    fetchEmployeeData()
    fetchSupplierData();
    fetchStatusData();
  }, []);

  useEffect(() => {
    setPayment(calcTotalPrice());
  }, [importOrderProducts]);

  const convertDataToRow = (): TableData[][] => {
    return importOrderProducts.map((item: ImportOrderProduct) => [
      <Box id="product-name-and-image">
        <Text id="product-name" as="p">
          {item.product.name} {item.product.deleted && <Badge tone='critical' size='small'>Deleted</Badge>}
        </Text>
        <Thumbnail source={item.product.image} alt="image" />
      </Box>,
      <div style={{ textAlign: "center" }}>{item.quantity}</div>,
      item.product.category.name,
      item.importPrice,
      item.importPrice * item.quantity,
      <div style={{ minWidth: "70px" }}>
        <ButtonGroup>
          <Button
            icon={EditIcon}
            onClick={() => handleClickEdit(item)}
            id="edit-order-product-btn"
          />
          <Button
            icon={DeleteIcon}
            tone="critical"
            onClick={() => handleClickDelete(item)}
            id="delete-order-product-btn"
          />
        </ButtonGroup>
      </div>,
    ]);
  };

  const calcTotalPrice = (): number => {
    return importOrderProducts?.reduce(
      (store: number, item: ImportOrderProduct) =>
        store + item.quantity * item.importPrice,
      0
    );
  };


  const handleUpdateItem = (data: ImportOrderProduct, id?: number) => {
    if (data?.product && data?.quantity) {
      setShowErr(false);
      setAddProductDialog(false);
      let isExist = false;
      const newOrderProducts = importOrderProducts?.map(
        (item: ImportOrderProduct) => {
          if (item.product.id === data.product.id || item.id === id) {
            isExist = true;
            return data;
          }
          return item;
        }
      );
      isExist ? setImportOrderProducts(newOrderProducts) : setImportOrderProducts(importOrderProducts.concat(data))
      

  
    } else {
      alert("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleClickDelete = (item: ImportOrderProduct) => {
    setImportOrderProducts(importOrderProducts.filter(o => o.id !== item.id))
  };

  const handleClickEdit = (item: ImportOrderProduct) => {
    setOrderProduct(item);
    setAddProductDialog(true);
  };

  const handleSubmit = async () => {
    if (importOrderProducts.length === 0) {
      setShowErr(true);
      return;
    }

    const newOrder = {
      id: order?.id,
      code, 
      payment,
      employee,
      supplier,
      status,
      note,
      importOrderProducts
    }

    await ClientCtr.saveImportOrder(newOrder)

    await fetchData()
    setOpen(false);
    setSelectedRows([]);
  };

  return (
    <div>
      {addProductDialog && (
        <AddOrderProductDialog
          handleUpdateItem={handleUpdateItem}
          data={orderProduct}
          open={addProductDialog}
          setOpen={setAddProductDialog}
        />
      )}
      <Modal
        size="large"
        title={order?.id ? "Sửa thông tin đơn hàng" : "Tạo đơn nhập hàng"}
        open={open}
        onClose={() => setOpen(false)}
        primaryAction={{
          content: "Lưu",
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: "Hủy",
            onAction: () => setOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <Grid>
            <Grid.Cell columnSpan={{ lg: 8, md: 4, xs: 6 }}>
              <FormLayout>
                <Grid>
                  <Grid.Cell columnSpan={{ xs: 6 }}>
                    <TextField
                      label="Ngày tạo đơn"
                      type="date"
                      value={moment(orderData?.createdAt).format("YYYY-MM-DD")}
                      disabled
                      autoComplete="off"
                      id="order-date"
                    />
                  </Grid.Cell>
                  <Grid.Cell columnSpan={{ xs: 6 }}>
                    <TextField
                      label="Mã vận đơn"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e)}
                      autoComplete="off"
                      id="delivery-code"
                    />
                  </Grid.Cell>
                </Grid>
                <Select
                  id="supplier-select"
                  label="Nhà cung cấp"
                  options={listSupplier.map((item: Supplier) => {
                    return {
                      label: item.name || "",
                      value: JSON.stringify(item),
                    };
                  })}
                  value={JSON.stringify(supplier)}
                  onChange={(value) => setSupplier(JSON.parse(value))}
                  placeholder="Chọn nhà cung cấp"
                />
                <TextField
                  id="note"
                  label="Ghi chú"
                  value={note}
                  onChange={(value) => setNote(value)}
                  multiline={3}
                  autoComplete="off"
                  maxLength={200}
                  showCharacterCount
                />
              </FormLayout>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, md: 2, lg: 4 }}>
              <BlockStack gap={'400'}>
                <Select
                    id="employee-select"
                    label="Nhân viên nhập hàng"
                    options={listEmployee.map((item: Employee) => {
                      return {
                        label: (item.id + ' - ' + item.name) || "",
                        value: JSON.stringify(item),
                      };
                    })}
                    value={JSON.stringify(employee)}
                    onChange={(value) => setEmployee(JSON.parse(value))}
                    placeholder="Chọn nhân viên"
                  />
                <Select
                    id="status-select"
                    label="Trạng thái đơn hàng"
                    options={listStatus.map((item: Status) => {
                      return {
                        label: item.name || "",
                        value: JSON.stringify(item),
                      };
                    })}
                    value={JSON.stringify(status)}
                    onChange={(value) => setStatus(JSON.parse(value))}
                    placeholder="Chọn trạng thái"
                  />
                
                <TextField
                  id="total-price"
                  label="Tổng hóa đơn"
                  value={
                    payment
                      ? (payment).toString()
                      : "0"
                  }
                  disabled
                  autoComplete=""
                />
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, md: 6, lg: 12 }}>
              <InlineStack gap="400">
                <Button
                  onClick={() => {
                    setAddProductDialog(true);
                    setOrderProduct(undefined);
                  }}
                  id="add-order-product-btn"
                >
                  Thêm mặt hàng
                </Button>
                {showErr && <Text tone="critical" as="p">Vui lòng nhập sản phẩm</Text>}
              </InlineStack>
              <DataTable
                columnContentTypes={[
                  "text",
                  "numeric",
                  "text",
                  "numeric",
                  "numeric",
                  "text",
                ]}
                headings={[
                  "Tên mặt hàng",
                  <div style={{ textAlign: "center" }}>Số lượng</div>,
                  "Loại",
                  "Giá",
                  "Tổng tiền",
                  "Thao tác",
                ]}
                rows={convertDataToRow()}
              />
            </Grid.Cell>
          </Grid>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default EditOrderDialog;
