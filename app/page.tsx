import type { Metadata } from "next";
import Editor from "./_ui/Editor";

const IndexPage = () => <Editor />;

export default IndexPage;

export const metadata: Metadata = {
  title: "Editor"
};
