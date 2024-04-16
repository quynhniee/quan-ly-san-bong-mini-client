import { BlockStack, Box, DropZone, Text } from "@shopify/polaris";

const DropZoneImage = ({ setImage }: { setImage: Function }) => {
  return (
    <BlockStack gap={"100"}>
      <Text as="span" variant="bodyMd">
        Hình ảnh
      </Text>
      {/* <img src="/images/products-image/code8.png" alt="123" /> */}
      <Box paddingInlineStart={"400"} paddingInlineEnd={"400"}>
        <BlockStack gap={"100"}>
          <DropZone
            errorOverlayText="Chỉ hỗ trợ định dạng File gif, jpg, jpeg, png"
            overlayText="Thả File vào đây để tải lên"
            type="image"
            accept="image/gif, image/jpg ,image/jpeg, image/png, image/webp"
            onDropAccepted={async (acceptedFiles: File[]) => {
              const url = URL.createObjectURL(acceptedFiles[0]);
              setImage(url);
            }}
            allowMultiple={false}
          >
            <DropZone.FileUpload
              actionTitle="Tải lên"
              actionHint="hoặc kéo thả ảnh"
            />
          </DropZone>
        </BlockStack>
      </Box>
    </BlockStack>
  );
};

export default DropZoneImage;
