exports.handler = async (event, context) => {
    try {
        console.log('Начало выполнения функции');

        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Тело запроса отсутствует' }),
            };
        }

        const filters = JSON.parse(event.body);
        console.log('Фильтры:', filters);

        console.log('Загрузка данных из внешнего API...');
        const response = await fetch('https://dataout.trendagent.ru/msk/apartments.json');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }

        const apartments = await response.json();
        console.log('Данные загружены:', apartments.length, 'квартир');

        console.log('Фильтрация данных...');
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

        console.log('Фильтрация завершена:', filteredApartments.length, 'квартир');

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