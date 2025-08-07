"use client";

import type { JSX } from "react";

import { withClass } from "@/ui";

import styles from "./MenuList.module.css";

type ListProps = JSX.IntrinsicElements["ul"];
type ItemProps = JSX.IntrinsicElements["li"];

export const MenuList = withClass<ListProps>('ul', styles.menu);
export const MenuItem = withClass<ItemProps>('li', styles.menuItem);

export default MenuList;
