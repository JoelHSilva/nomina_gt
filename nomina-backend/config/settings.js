module.exports = {
    // Configuración general del sistema
    appName: 'Sistema de Nómina Guatemalteca',
    appVersion: '1.0.0',
    env: process.env.NODE_ENV || 'development',
    
    // Configuración de la aplicación
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    
    // Configuración de nómina (valores por defecto)
    payrollSettings: {
      currency: 'GTQ',
      currencySymbol: 'Q',
      decimalPlaces: 2,
      defaultYear: new Date().getFullYear(),
      
      // Días laborales por defecto (Guatemala)
      workingDaysPerWeek: 6,
      workingHoursPerDay: 8,
      
      // Tipos de periodo de pago
      paymentPeriods: {
        QUINCENAL: 'Quincenal',
        MENSUAL: 'Mensual',
        BONO14: 'Bono14',
        AGUINALDO: 'Aguinaldo'
      },
      
      // Estados de nómina
      payrollStatus: {
        DRAFT: 'Borrador',
        VERIFIED: 'Verificada',
        APPROVED: 'Aprobada',
        PAID: 'Pagada'
      }
    },
    
    // Rutas base para la API
    api: {
      prefix: '/api/v1'
    }
  };