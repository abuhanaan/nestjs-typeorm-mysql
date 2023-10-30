export class CreateUserDto {
  username: string;
  password: string;
  confirmPassword: string;
}

export type UpdateUserDto = {
  username: string;
  password: string;
};
