import { View, Text } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";
import { RoundBtn } from "./round-btn";

export const Dropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <RoundBtn icon={"ellipsis-horizontal"} text="More" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Item key="statement">
          <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
          {/* <DropdownMenu.ItemIcon androidIconName="dialog_frame" /> */}
        </DropdownMenu.Item>
        <DropdownMenu.Item key="add">
          <DropdownMenu.ItemTitle>Add new account</DropdownMenu.ItemTitle>
          {/* <DropdownMenu.ItemIcon androidIconName="dialog_frame" /> */}
        </DropdownMenu.Item>
        <DropdownMenu.Item key="statement">
          <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
          {/* <DropdownMenu.ItemIcon androidIconName="dialog_frame" /> */}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
