npx create-expo-stack@latest

supabase init
supabase link
supabase migrations new lists
supabase start

supabase gen types --lang=typescript --local > utils/database.types.ts

supabase functions new list  
supabase functions serve

npx uri-scheme open exp://127.0.0.1:8081/--/wishlist/1 --ios

npx expo export -p web
netlify deploy --dir dist

eas env:push production --path .env.prod
eas build
eas build --profile development  --local -p android