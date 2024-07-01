import { registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import Form from "./app";

registerBlockType("wpui-sample-plugin/profile-form", {
  title: __("Profile Form"),
  icon: "admin-users",
  category: "widgets",
  edit: Form,
  save: () => null, // Le contenu sera rendu dynamiquement côté serveur
});
