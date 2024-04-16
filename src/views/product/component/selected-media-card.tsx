import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  InlineStack,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { DeleteIcon, ImageIcon } from "@shopify/polaris-icons";
import { memo } from "react";

interface ISelectedMediaCard {
  imageUrl: string;
  filename: string;
  setImage: Function;
}

export default memo(function SelectedMediaCard(props: ISelectedMediaCard) {
  const { imageUrl, filename, setImage } = props;

  return (
    <Box
      borderColor="border"
      borderWidth="025"
      borderRadius="200"
      padding={"300"}
    >
      <InlineStack
        wrap={false}
        gap={"200"}
        blockAlign="center"
        align="space-between"
      >
        <Box width="calc(100% - 150px)">
          <InlineStack
            wrap={false}
            gap={"200"}
            blockAlign="center"
            align="start"
          >
            <Thumbnail
              size="large"
              source={imageUrl ? imageUrl : ImageIcon}
              alt="Onetick upsell checkbox"
            />
            <Box width="100%">
              <BlockStack gap={"100"} inlineAlign="start">
                <Box width="100%">
                  <Text as="span" variant="bodySm" truncate>
                    {filename}
                  </Text>
                </Box>
              </BlockStack>
            </Box>
          </InlineStack>
        </Box>
        <ButtonGroup>
          <input
            type="file"
            id="upload-file"
            style={{ display: "none" }}
            accept="image/gif, image/jpg ,image/jpeg, image/png"
            multiple={false}
            onChange={(e) => {
              const url = URL.createObjectURL((e.target.files as any)[0]);
              setImage(url);
            }}
          />
          <label
            htmlFor="upload-file"
            className="Polaris-Button Polaris-Button--pressable Polaris-Button--variantSecondary Polaris-Button--sizeMedium Polaris-Button--textAlignCenter"
            style={{ fontSize: 12 }}
          >
            Chỉnh sửa
          </label>

          <Button
            icon={DeleteIcon}
            onClick={() => {
              setImage(() => "");
            }}
          />
        </ButtonGroup>
      </InlineStack>
    </Box>
  );
});
