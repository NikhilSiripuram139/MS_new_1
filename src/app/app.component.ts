import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Manage-MS-Frontend';

  constructor(private http: HttpClient) { }

  Client_Id = environment.CLIENT_ID;
  tenant_id = environment.TENANT_ID;

  users: any = [];
  api=environment.api;
  myurl = environment.myurl;
  user: any;


  redirectUri = `${this.api}/account/auth/callback`;
  post_logout_redirect_uri = `${this.api}/account/auth/logout`;

  async ngOnInit() {
    try {
      await this.http.get(`${this.api}/user/all`).subscribe((data) => {
        this.users = data;
      });

    } catch (error) {
      throw new Error(`Unables to fetch users!:${error}`);
    }
  }

  async addNewLicence() {

    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${this.Client_Id}&response_type=code&redirect_uri=${this.redirectUri}&scope=openid profile offline_access https://graph.microsoft.com/User.Read https://graph.microsoft.com/Files.ReadWrite.All`
    // window.location.href = `https://login.microsoftonline.com/${this.tenant_id}/oauth2/v2.0/authorize?client_id=${this.Client_Id}&response_type=code&redirect_uri=${this.redirectUri}&response_mode=query&scope=openid profile offline_access User.Read&state=12345`
    // window.location.href = `https://login.microsoftonline.com/common/${this.tenant_id}/oauth2/v2.0/authorize?client_id=${this.Client_Id}&response_type=code&redirect_uri=${this.redirectUri}&scope=openid profile offline_access User.Read&prompt=consent&post_logout_redirect_uri=${this.post_logout_redirect_uri}`;

  }

  async onlogin(user: any) {
    


    if (this.user === undefined || this.user.id !== user.id) {

      this.user = user;
      window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${this.Client_Id}&response_type=code&redirect_uri=${this.redirectUri}&scope=openid profile offline_access&prompt=login`;


      try {

        await this.http.post(`${this.api}/account/login`, user).subscribe(async (res) => {
          if (res) {
            await this.http.get(`${this.api}/user/all`).subscribe((data) => {
              this.users = data;
              window.location.href = `${this.myurl}`;
            });
          }
          else return
        });



      } catch (err) {
        console.log(err);
      }
    } else return

  }

  async gotoWord(userId: string) {

    const data = { id: userId };

    try {
      await this.http.post(`${this.api}/account/token`, data).subscribe((data: any) => {
        if (data) {
          console.log(data);
          let token = data.access_token;
          // Redirect to MS Word Online with the token
          const wordUrl = `https://word.office.com?access_token=${token}`;
          // window.location.href = wordUrl;
          window.open(wordUrl, '_blank');
        } else {
          console.error('No token found');
        }
      });
    } catch (err) {
      console.log(err);
    }

  }

  async gotoExcel(userId: string) {

    const data = { id: userId };
    try {
      await this.http.post(`${this.api}/account/token`, data).subscribe((data) => {
        if (data) {
          console.log(data);

          // Redirect to MS Word Online with the token
          const excelUrl = `https://excel.office.com?access_token=${data}`;
          window.open(excelUrl, '_blank');
        } else {
          console.error('No token found');
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  async logout(userId: string) {
    try {

      window.open(`https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${this.post_logout_redirect_uri}`, '_blank');

      const data = { userId }
      await this.http.post(`${this.api}/account/logout`, data).subscribe(() => {

        // Redirect to Home page
        window.location.href = `${this.myurl}`;

        console.log('Logged out successfully!');
      });


    } catch (err) {
      console.log(err);
    }
  }

}
