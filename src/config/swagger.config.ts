import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Danh sách API thương hiệu K-Project')
  .setDescription('API chuyên biệt cho việc quản lý và tự động hóa các hoạt động bán hàng.')
  .setVersion('1.0.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
  )
  .addSecurityRequirements('JWT-auth')
  .build();
