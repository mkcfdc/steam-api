// utils/loadRoutes.js
import fs from 'fs';

export const loadRoutes = (app, routesDirectoryURL) => {
    fs.readdirSync(routesDirectoryURL, { withFileTypes: true }).forEach(async (dirent) => {
        if (dirent.isDirectory()) {
            // If it's a directory, read the files inside it
            const nestedDirURL = new URL(`${dirent.name}/`, routesDirectoryURL);
            loadRoutes(app, nestedDirURL); // Recursively load routes from nested directories
        } else if (dirent.isFile() && dirent.name.endsWith('.route.js')) {
            // If it's a route file, import and use the route
            const route = await import(new URL(dirent.name, routesDirectoryURL));
            app.use(route.default); // Use the routes as defined in the file
        }
    });
};