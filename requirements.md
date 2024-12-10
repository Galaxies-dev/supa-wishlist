Create a Wishlist application using React Native, Expo, and Supabase with the following functionality:

Overview:
	•	Purpose: Users can create wishlists, add items with links, and share the lists with friends.
	•	Styling: Use NativeWind for Tailwind-style utility-first CSS.
	•	Database: Use Supabase to handle user authentication, and the types from the @/utils/database.types.ts

Pages and Features:
	1.	Authentication:
	•	Login/Signup Page: Allow users to sign in or sign up with email and password. Use Supabase Auth.
	•	Forgot Password Page: Include an option for users to reset their password.
	2.	Home Page (Dashboard):
	•	Show a list of the user’s wishlists.
	•	Provide a button to create a new wishlist.
	•	Include logout functionality.
	3.	Create/Edit Wishlist Page:
	•	Allow users to name the wishlist.
	•	Provide a form to add items to the list:
	•	Fields: Item Name, Product Link (URL).
	•	Add button to add items to the list dynamically.
	•	Display a preview of the wishlist items.
	•	Allow users to delete or edit individual items.
	•	Save the wishlist to Supabase.
	4.	Wishlist Details Page:
	•	Display the wishlist items with their names and clickable product links.
	•	Provide a “Share Wishlist” button that generates a unique sharing link using Supabase.
	5.	Shared Wishlist Page:
	•	Render a read-only version of a shared wishlist based on the unique link.
	•	Display items with names and clickable links.
	6.	Settings Page:
	•	Allow users to update their profile (name, email).
	•	Option to delete their account.

Styling:
	•	Use NativeWind to style all components, ensuring a clean, responsive UI.
	•	Use a color scheme that resembles the Supabase CI
  
Additional Requirements:
	•	Styling: Use NativeWind to style all components, ensuring a clean, responsive UI.
	•	Database Schema (in Supabase):
	•	Users table: Store user details (id, email, name).
	•	Wishlists table: Store wishlist details (id, user_id, title, created_at).
	•	Wishlist Items table: Store items (id, wishlist_id, name, product_link).
	•	Routing: Use Expo Router to manage navigation between pages.

Developer Notes:
	•	Include clear comments for each component.
	•	Ensure TypeScript types for all props, state, and API responses.
	•	Optimize for performance with debounced inputs and lazy loading where needed.
	•	Ensure accessibility (e.g., ARIA roles, focus management).