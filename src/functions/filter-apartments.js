exports.handler = async (event, context) => {
    try {
        console.log('Получен запрос:', event);

        let filters = {};

        // Обработка GET-запроса
        if (event.httpMethod === 'GET') {
            // Извлекаем параметры из query-строки
            filters = event.queryStringParameters || {};
            console.log('Фильтры из GET-запроса:', filters);
        }
        // Обработка POST-запроса
        else if (event.httpMethod === 'POST') {
            // Проверяем наличие тела запроса
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Тело запроса отсутствует' }),
                };
            }
            // Парсим тело запроса
            filters = JSON.parse(event.body);
            console.log('Фильтры из POST-запроса:', filters);
        }
        // Если метод не GET и не POST
        else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Метод не поддерживается' }),
            };
        }

        // Загрузка данных из внешнего API
        const response = await fetch('https://dataout.trendagent.ru/msk/apartments.json');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }
        const apartments = await response.json();
        console.log('Квартиры загружены:', apartments);

        // Фильтрация квартир
        const filteredApartments = apartments.filter(apartment => {
            return (
                (!filters.block || apartment.block_id === filters.block) &&
                (!filters.district || apartment.block_district_id === filters.district) &&
                (!filters.subway || apartment.block_subway_ids.includes(filters.subway)) &&
                (!filters.builder || apartment.block_builder_id === filters.builder) &&
                (!filters.rooms || apartment.room === filters.rooms) &&
                (!filters.finishing || apartment.finishing === filters.finishing) &&
                (!filters.priceFrom || apartment.price >= filters.priceFrom) &&
                (!filters.priceTo || apartment.price <= filters.priceTo) &&
                (!filters.areaFrom || apartment.area_total >= filters.areaFrom) &&
                (!filters.areaTo || apartment.area_total <= filters.areaTo)
            );
        });

        console.log('Отфильтрованные квартиры:', filteredApartments);

        // Возвращаем результат
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify(filteredApartments),
        };
    } catch (error) {
        console.error('Ошибка в функции:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Внутренняя ошибка сервера" }),
        };
    }
};