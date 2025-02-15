// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { AuthService } from './auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(private authService: AuthService) {
//     super({
//       clientID: 'SEU_CLIENT_ID_GOOGLE',
//       clientSecret: 'SEU_CLIENT_SECRET_GOOGLE',
//       callbackURL: 'http://localhost:3000/auth/google/callback',
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
//     const user = await this.authService.findOrCreate(profile);
//     done(null, user);
//   }
// }