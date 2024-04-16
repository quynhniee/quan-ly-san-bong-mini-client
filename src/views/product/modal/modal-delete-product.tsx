import { BlockStack, Text, Modal } from "@shopify/polaris";
import { useModal } from "../../../hook/useModal";
import { EModal } from "../../../constants";
import { useState } from "react";
import ClientCtr from "../../../ClientCtr";

const ModalDeleteProduct = ({
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

  const handleSubmit = () => {
    setIsLoading(true);
    handleDeleteProduct2(selectedRows).then(() => {
      setIsLoading(false);
      handleCloseModal();
    });
  };

  const handleCloseModal = () => {
    closeModal(EModal.MODAL_DELETE_PRODUCT);
  };

  return (
    <Modal
      open={state[EModal.MODAL_DELETE_PRODUCT]?.active}
      title={`Xác nhận xoá ${selectedRows.length} mặt hàng`}
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
            Mặt hàng đã xoá sẽ không thể khôi phục lại.
          </Text>
          <Text as="p" variant="bodyMd">
            Tiếp tục xoá?
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default ModalDeleteProduct;
