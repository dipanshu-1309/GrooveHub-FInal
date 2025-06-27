Project Overview
- GrooveHub is a mobile social media platform for dancers to share videos, photos, and interact via rich text posts.
- People wanting to learn Dance can Explore the Courses Tab in Future

Features
- User authentication via Supabase
- Profile editing with image upload
- Posting videos and photos
- Rich text content support
- Real-time comments and updates

Tech Stack & Libraries Used

- Icons: All icons are sourced from (https://hugeicons.com).
- Images:
- `expo-image` is used for optimized image rendering (e.g., in the `Avatar` component).
- `expo-image-picker` is used for uploading profile pictures during profile editing.
- `expo-file-system` is used to handle image uploads as array buffers (from base64) because direct file uploads can fail during updates.
- Rich Text Editor: `react-native-pell-rich-editor` is used for rich text input fields.
- Videos: `expo-av` is used to handle video playback and uploads in posts.