import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Alumnus } from './alumnus.model';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AlumnusService {

  private alumni: Alumnus[] = [];
  private alumniUpdated = new Subject<{ alumni: Alumnus[]; alumniCount: number}>();

  constructor(public http: HttpClient, private router: Router) { }

  getAlumni(alumniPerPage: number, currentPage: number) {

    const queryParams = `?pagesize=${alumniPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string, alumni: any, maxAlumni: number }>(
        "http://localhost:3000/api/alumni" + queryParams
      )
      .pipe(
        map(alumnusData => {
          return {
            alumni: alumnusData.alumni.map(alumnus => {
              return {
                id: alumnus._id,
                name: alumnus.name,
                profession: alumnus.profession,
                bio: alumnus.bio,
                imagePath: alumnus.imagePath
              };
            }),
            maxAlumni: alumnusData.maxAlumni
          };
        })
      )
      .subscribe(cleansedAlumni => {
        this.alumni = cleansedAlumni.alumni;
        this.alumniUpdated.next({
          alumni: [...this.alumni],
          alumniCount: cleansedAlumni.maxAlumni
        });
      });
  }

  getAlumnusUpdateListener() {
    return this.alumniUpdated.asObservable();
  }

  getAlumnus(id: string) {
    return this.http.get<{ 
      _id: string,
      name: string, 
      profession: string, 
      bio: string, 
      imagePath: string 
    }>(
      "http://localhost:3000/api/alumni/" + id
    );
  }

  addAlumni(name: string, profession: string, bio: string, image: File) {
    const alumnusData = new FormData();
    alumnusData.append("name", name); 
    alumnusData.append("profession", profession);
    alumnusData.append("bio", bio);
    alumnusData.append("image", image, name);
    console.log("Alumnus data");
    console.log(name);
    console.log(profession);
    console.log(bio);
    console.log(image);
    this.http
      .post<{ message: string; alumnus: Alumnus }>(
        "http://localhost:3000/api/alumni",
        alumnusData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateAlumnus(id: string, name: string, profession: string, bio: string, image: File | string) {
    /*
    const alumnus: Alumnus = { id: id, name: name, profession: profession, bio: bio }
    this.http.put("http://localhost:3000/api/alumni/" + id, alumnus)
      .subscribe(response => {
        const updatedAlumni = [...this.alumni];
        const oldAlumniIndex = updatedAlumni.findIndex(a => a.id === alumnus.id);
        this.alumni = updatedAlumni;
        this.alumniUpdated.next([...this.alumni]);
      }) */
      let alumnusData: Alumnus | FormData;
      if (typeof image === "object") {
        alumnusData = new FormData();
        alumnusData.append("id", id);
        alumnusData.append("name", name);
        alumnusData.append("profession", profession);
        alumnusData.append("bio", bio);
        alumnusData.append("image", image, name);
      } else {
        alumnusData = {
          id: id,
          name: name,
          bio: bio,
          profession: profession,
          imagePath: image
        };
      }
      this.http
        .put("http://localhost:3000/api/news/" + id, alumnusData)
        .subscribe( response => {
            this.router.navigate(["/"]);
        });
  }


  deleteAlumni(alumnusId: string) {
    /*
    this.http.delete("http://localhost:3000/api/alumni/" + alumnusId)
      .subscribe(() => {
        const updatedAlumni = this.alumni.filter(alumni => alumni.id !== alumnusId)
        this.alumni = updatedAlumni;
        this.alumniUpdated.next([...this.alumni]);
      }); */
    return this.http.delete("http://localhost:3000/api/alumni/" + alumnusId);
      /*
      .subscribe( response => {
        console.log(response);
      }); */
  }
}