<template>
  <div class="container-photos mt-20">
    <label class="file-select">
      <div class="select-button bg-evergreen-dark-500 cursor-pointer">
        <span>Take photo</span>
      </div>
      <input type="file" multiple @change="handleFileChange" />
    </label>
    <div v-if="photos" class="flex flex-wrap -mx-2 mb-8">
      <div v-for="(image, key) in photos" :key="key" class="w-1/3 p-2">
        <div class="relative">
          <button
            class="flex items-center justify-center absolute top-[-10px] right-[-5px] h-[25px] p-2 rounded-full bg-red-500 text-white"
            @click="removeImage(key)">
            X
          </button>
          <a :href="image" download>
            <img :src="image" :alt="'Image ' + key" class="w-full max-h-[100px]" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const photos = ref([]);
const photoFiles = ref([]);

const handleFileChange = (e) => {
  const files = e.target.files;
  previewFile(files);
};

const previewFile = (files) => {
  const newPhotoFiles = files;
  const validPhotoFiles = [];

  for (let i = 0; i < newPhotoFiles.length; i++) {
    let photo = URL.createObjectURL(newPhotoFiles[i]);
    photos.value.push(photo);
    validPhotoFiles.push(newPhotoFiles[i]);
  }

  photoFiles.value = validPhotoFiles;
};
</script>

<style scoped>
.file-select>.select-button {
  border-radius: 4px;
  border: none;
  color: #FFFFFF;
  max-width: 200px;
  padding: 8px;
  text-align: center;
}
</style>