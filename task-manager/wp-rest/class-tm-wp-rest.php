<?php

class TM_WP_Rest {

    public static function task_manager_register_routes() {
        // Register REST API routes for the Task Manager
        register_rest_route('task-manager/v1', '/get-tasks', [
            'methods' => 'GET',
            'callback' => [self::class, 'task_manager_get_tasks'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('task-manager/v1', '/save-tasks', [
            'methods' => 'POST',
            'callback' => [self::class, 'task_manager_create_task'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('task-manager/v1', '/update-tasks/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [self::class, 'task_manager_update_task'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('task-manager/v1', '/delete-tasks/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [self::class, 'task_manager_delete_task'],
            'permission_callback' => '__return_true',
        ]);
    }

    // Fetch all tasks
    public static function task_manager_get_tasks() {

        error_log('inside get tasks rest api');
        $tasks = get_posts([
            'post_type' => 'task',
            'numberposts' => -1,
            'post_status' => 'publish',
        ]);

        $data = [];
        if (empty($tasks)) {
            return new WP_REST_Response($data, 200);
        }

        foreach ($tasks as $task) {
            $data[] = [
                'id' => $task->ID,
                'title' => $task->post_title,
                'content' => $task->post_content,
                'status' => get_post_meta($task->ID, 'status', true),
            ];
        }

        return new WP_REST_Response($data, 200);
    }

    // Create a new task
    public static function task_manager_create_task($request) {
        $params = $request->get_json_params();
        
        // Validate required fields
        if (empty($params['title']) || empty($params['status'])) {
            return new WP_REST_Response(['message' => 'Title and status are required'], 400);
        }

        $task_id = wp_insert_post([
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => sanitize_text_field($params['content']),
            'post_type' => 'task',
            'post_status' => 'publish',
        ]);

        if ($task_id) {
            update_post_meta($task_id, 'status', sanitize_text_field($params['status']));
            return new WP_REST_Response(['message' => 'Task created successfully', 'id' => $task_id], 201);
        }

        return new WP_REST_Response(['message' => 'Task creation failed'], 500);
    }

    // Update an existing task
    public static function task_manager_update_task($request) {
        $task_id = (int) $request['id'];
        $params = $request->get_json_params();

        if (empty($params['title']) || empty($params['status'])) {
            return new WP_REST_Response(['message' => 'Title and status are required'], 400);
        }

        // Check if task exists
        if (!get_post($task_id)) {
            return new WP_REST_Response(['message' => 'Task not found'], 404);
        }

        $updated = wp_update_post([
            'ID' => $task_id,
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => sanitize_text_field($params['content']),
        ]);

        if ($updated) {
            update_post_meta($task_id, 'status', sanitize_text_field($params['status']));
            return new WP_REST_Response(['message' => 'Task updated successfully', 'id' => $task_id], 200);
        }

        return new WP_REST_Response(['message' => 'Task update failed'], 500);
    }

    // Delete a task
    public static function task_manager_delete_task($request) {
        $task_id = (int) $request['id'];

        // Check if task exists
        if (!get_post($task_id)) {
            return new WP_REST_Response(['message' => 'Task not found'], 404);
        }

        $deleted = wp_delete_post($task_id);

        if ($deleted) {
            return new WP_REST_Response(['message' => 'Task deleted successfully', 'id' => $task_id], 200);
        }

        return new WP_REST_Response(['message' => 'Task deletion failed'], 500);
    }
}
