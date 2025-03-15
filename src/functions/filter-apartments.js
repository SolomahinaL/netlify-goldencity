exports.handler = async (event, context) => {
  try {
    const filters = JSON.parse(event.body); // Получаем фильтры из запроса

    // Здесь вы можете добавить логику для фильтрации данных
    const filteredData = [
      { id: 1, name: "Квартира 1", price: 1000000, area: 50 },
      { id: 2, name: "Квартира 2", price: 2000000, area: 70 },
    ];

    return {
      statusCode: 200,
      body: JSON.stringify(filteredData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};