import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const ModelSelection = ({ onModelSelect }) => {
  const [selectedModel, setSelectedModel] = React.useState(new Set(["phi3"]));

  // Convert the selected set into a readable string
  const selectedModelLabel = React.useMemo(
    () => Array.from(selectedModel).join(", ").replaceAll("_", " "),
    [selectedModel]
  );

  // Notify the parent component when the selected model changes
  useEffect(() => {
    if (onModelSelect) {
      onModelSelect(Array.from(selectedModel).join(", "));
    }
  }, [selectedModel, onModelSelect]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedModelLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Select Model"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedModel}
        onSelectionChange={setSelectedModel}
      >
        <DropdownItem key="phi3">Phi3</DropdownItem>
        <DropdownItem key="mistral">Mistral</DropdownItem>
        <DropdownItem key="llama">Llama</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ModelSelection;
