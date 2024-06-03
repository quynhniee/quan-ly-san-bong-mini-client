import { BlockStack, Text, Modal } from "@shopify/polaris";
import { useModal } from "../../../hook/useModal";
import { EModal } from "../../../constants";
import { useEffect, useState } from "react";
import ClientCtr from "../../../ClientCtr";

const ModalDeleteSupplier = ({
  selectedRows = [],
  setSelectedRows = () => {},
  type,
}: {
  selectedRows: number[];
  setSelectedRows: Function;
  type: string;
}) => {
  const { state, closeModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteProduct2 = async (arr: number[]) => {
    await ClientCtr.deleteProductsById(arr);
    setSelectedRows([]);
  };

  const handleDeleteOrder = async (arr: number[]) => {
    await ClientCtr.deleteImportOrdersById(arr);
    setSelectedRows([]);
  }

  const handleDeleteSupplier = async (arr: number[]) => {
    await ClientCtr.deleteSuppliersById(arr);
    setSelectedRows([]);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    if (type === 'orders') {
      await handleDeleteOrder(selectedRows).then(() => {
        setIsLoading(false);
        handleCloseModal();
      })

    }
    else if (type === 'products') {
      await handleDeleteProduct2(selectedRows).then(() => {
        setIsLoading(false);
        handleCloseModal();
      });
    }
    else if (type === 'suppliers') {
      await handleDeleteSupplier(selectedRows).then(() => {
        setIsLoading(false);
        handleCloseModal();
      });
    }
  };

  const handleCloseModal = () => {
    closeModal(EModal.MODAL_DELETE_SUPPLIER);
  };

  useEffect(() => {
    setIsLoading(false);
    console.log(state)
  }, [state])

  return (
    <Modal
      open={state[EModal.MODAL_DELETE_SUPPLIER]?.active}
      title={`Xác nhận xoá ${selectedRows.length} ${type === 'orders' ? 'đơn nhập hàng' : type === 'suppliers' ? 'nhà cung cấp' : 'mặt hàng'}`}
      onClose={handleCloseModal}
      primaryAction={{
        content: "Xác nhận",
        onAction: handleSubmit,
        loading: isLoading,
      }}
      secondaryActions={[
        {
          content: "Huỷ",
          onAction: () => {
            handleCloseModal();
          },
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap={"300"}>
          <Text as="p" variant="bodyMd">
            {type === 'orders' ? 'Đơn hàng' : type === 'suppliers' ? 'Nhà cung cấp' : 'Mặt hàng'} đã xoá sẽ không thể khôi phục lại.
          </Text>
          <Text as="p" variant="bodyMd">
            Tiếp tục xoá?
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default ModalDeleteSupplier;
