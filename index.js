/**
 * Render Bootloader
 * This file serves as the entry point for Render deployments.
 * It ensures Render can find the 'index.js' module at the project root
 * and bridges it to the actual server implementation.
 */

console.log('🚀 Booting Watch Party Server from root...');
require('./server/index.js');
