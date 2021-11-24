import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty()
  page: string;
  @ApiProperty()
  size: string;
  @ApiProperty()
  search: string;
}
