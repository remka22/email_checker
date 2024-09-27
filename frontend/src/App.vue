<script setup lang="ts">
import { ref, computed } from 'vue';
import axios, { CancelTokenSource } from 'axios';
import apiClient from './api/apiClient';

//Поля ввода
const email = ref('');
const number = ref('');

//Переменные ошибок валидации
const emailError = ref('');
const numberError = ref('');

//Результат ответа сервера
const results = ref<any[]>([]);

const errorMessage = ref('');
const isLoading = ref(false);


let cancelTokenSource: CancelTokenSource | null = null;

//Валидация почты
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailError.value = emailRegex.test(email.value) ? '' : 'Invalid email address';
};

//Валидация номера
const validateNumber = () => {
  const numberWithoutDashes = number.value.replace(/-/g, '');
  numberError.value = numberWithoutDashes.length === 6 || numberWithoutDashes.length === 0 ? '' : 'Invalid number';
};

// Функция для отправки запроса
const sendRequest = async () => {
  validateEmail()
  validateNumber()
  if (emailError.value || numberError.value) return; // Если есть ошибка в email, не отправляем запрос

  isLoading.value = true;
  errorMessage.value = '';
  results.value = []; // Очищаем предыдущие результаты

  // Отмена предыдущего запроса
  if (cancelTokenSource) {
    cancelTokenSource.cancel('Request canceled due to new request.');
  }
  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await apiClient.post(
      '/validate',
      { email: email.value, number: number.value },
      { cancelToken: cancelTokenSource.token }
    );
    results.value = response.data; // Записываем все найденные записи
    isLoading.value = false;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Previous request canceled.');
    } else {
      errorMessage.value = error.response?.data?.message || 'Server offline ';
    }
    isLoading.value = false;
  } finally {
    // isLoading.value = false;
  }
};

</script>

<template>
  <div>
    <h1>Home Page</h1>
    <form>
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required @blur="validateEmail" />
        <span v-if="emailError">{{ emailError }}</span>
      </div>

      <div>
        <label for="number">Number:</label>
        <input id="number" v-model="number" v-mask="'##-##-##'" placeholder="__-__-__"
         required @blur="validateNumber"/>
        <span v-if="numberError">{{ numberError }}</span>
      </div>

      <button type="button" v-on:click="sendRequest()">Submit</button>
    </form>

    <div v-if="isLoading" class="spinner"></div>

    <div v-if="results.length" class="results">
      <h3>Results:</h3>
      <p v-for="(result, index) in results" :key="index">
        email: {{ result.email }}, number: {{ result.number.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3') }}
      </p>
    </div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f8f8f8;
  margin: 0;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
}

form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

span {
  color: red;
  font-size: 12px;
}

.results {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
}

.error-message {
  color: red;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
}

/* Спиннер для индикации загрузки */
.spinner {
  border: 4px solid #f3f3f3; /* Светлый цвет для фона */
  border-top: 4px solid #007bff; /* Цвет спиннера */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

/* Анимация вращения спиннера */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>