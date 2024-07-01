<?php
/**
 * Plugin Name: WPUI Sample Plugin
 * Update URI:  wpui-sample-plugin
 */

function wsp_register_block()
{
    $asset_file = include plugin_dir_path(__FILE__) . "build/block.asset.php";

    wp_register_script(
        "wpui-sample-plugin-block",
        plugins_url("build/block.js", __FILE__),
        $asset_file["dependencies"],
        $asset_file["version"]
    );

    register_block_type("wpui-sample-plugin/profile-form", [
        "editor_script" => "wpui-sample-plugin-block",
        "render_callback" => "wsp_render_profile_form",
    ]);
}
add_action("init", "wsp_register_block");

function wsp_render_profile_form()
{
    return '<div id="wpui-sample-plugin" class="placeholder-styles"></div>';
}

function wsp_enqueue_block_assets()
{
    if (has_block("wpui-sample-plugin/profile-form")) {
        $asset_file = include plugin_dir_path(__FILE__) .
            "build/index.asset.php";

        wp_enqueue_script(
            "wpui-sample-plugin",
            plugins_url("build/index.js", __FILE__),
            $asset_file["dependencies"],
            $asset_file["version"],
            true
        );

        wp_enqueue_style(
            "wpui-sample-plugin",
            plugins_url("build/index.css", __FILE__),
            [],
            $asset_file["version"]
        );

        wp_localize_script("wpui-sample-plugin", "wpuiSamplePlugin", [
            "ajaxurl" => admin_url("admin-ajax.php"),
            "nonce" => wp_create_nonce("wpui_sample_plugin_nonce"),
        ]);
    }
}
add_action("enqueue_block_assets", "wsp_enqueue_block_assets");

function wsp_send_form_data()
{
    // Vérifier le nonce
    if (!wp_verify_nonce($_POST["nonce"], "wpui_sample_plugin_nonce")) {
        wp_send_json_error("Invalid nonce");
        exit();
    }

    $form_data = json_decode(stripslashes($_POST["form_data"]), true);

    $to = get_option("admin_email");
    $subject = "New Profile Form Submission";
    $message = "A new profile form has been submitted:\n\n";

    foreach ($form_data as $key => $value) {
        $message .=
            ucfirst(str_replace("_", " ", $key)) .
            ": " .
            (is_array($value) ? implode(", ", $value) : $value) .
            "\n";
    }

    $sent = wp_mail($to, $subject, $message);

    if ($sent) {
        wp_send_json_success("Email sent successfully");
    } else {
        wp_send_json_error("Failed to send email");
    }
}
add_action("wp_ajax_wsp_send_form_data", "wsp_send_form_data");
add_action("wp_ajax_nopriv_wsp_send_form_data", "wsp_send_form_data");
