import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

let currentTimeout: NodeJS.Timeout | null = null;

// Валидация email
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Валидация номера
const validateNumber = (number: string): boolean => {
    const numberRegex = /^\d{6}$/; // Проверяем, что номер состоит из 6 цифр
    return numberRegex.test(number);
};

router.post('/validate', (req: Request, res: Response) => {
    const { email, number } = req.body;

    // Валидация входных данных
    if (!validateEmail(email)) {
        res.status(400).json({ message: 'Invalid email format.' });
    }

    if (number && !validateNumber(number.replace(/-/g, ''))) {
        res.status(400).json({ message: 'Number must be 6 digits long.' });
    }

    // Отменяем предыдущий таймер, если он существует
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }

    currentTimeout = setTimeout(() => {
        const filePath = path.join(__dirname, '../files/user_data.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Фильтруем данные по email и (опционально) по number
        const found = data.filter((item: any) => {
            return (
                item.email === email &&
                (!number || item.number === number.replace(/-/g, '')) // Убираем дефисы для сравнения
            );
        });

        if (found.length > 0) {
            res.json(found); // Возвращаем все найденные записи
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    }, 5000); // 5 секунд задержки
});


export default router;