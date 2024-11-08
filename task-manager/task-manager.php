<?php
/*
Plugin Name: Task Manager
Description: A task management plugin built with React.
Version: 1.0
Author: Your Name
*/

require_once 'wp-rest/class-tm-wp-rest.php';

add_action( 'rest_api_init', array( TM_WP_Rest::class, 'task_manager_register_routes' ) );

function task_manager_enqueue_scripts($hook) {
    // Ensure script loads only on the Task Manager admin page
    if ($hook !== 'toplevel_page_task-manager') {
        return;
    }

    // Locate the correct main.*.js file in the build folder
    $js_dir = plugin_dir_path(__FILE__) . 'build/static/js/';
    $files = glob($js_dir . 'main.*.js'); // Finds the main.*.js file
    $main_js = $files ? plugin_dir_url(__FILE__) . 'build/static/js/' . basename($files[0]) : '';

    if ($main_js) {
        wp_enqueue_script(
            'task-manager-app',
            $main_js,
            ['wp-element'], // Loads WordPress's bundled React library
            filemtime($files[0]), // Version based on modification time
            true
        );

        wp_localize_script('task-manager-app', 'taskManager', [
            'apiUrl' => esc_url_raw(rest_url('task-manager/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
        ]);
    }
}
add_action('admin_enqueue_scripts', 'task_manager_enqueue_scripts');

function task_manager_admin_menu() {
    add_menu_page(
        'Task Manager',
        'Task Manager',
        'manage_options',
        'task-manager',
        'task_manager_render_app',
        'dashicons-list-view', // Icon for the menu item
        26
    );
}
add_action('admin_menu', 'task_manager_admin_menu');

function task_manager_render_app() {
    echo '<div id="root"></div>';
}
