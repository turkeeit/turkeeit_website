export const groupServicesByCategory = (services = []) => {
  return services.reduce((acc, service) => {
    const categoryId = service.category_id;

    if (!acc[categoryId]) {
      acc[categoryId] = {
        categoryId,
        services: [],
      };
    }

    acc[categoryId].services.push(service);
    return acc;
  }, {});
};
