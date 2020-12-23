import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Alumnus } from '../alumnus.model';
import { AlumnusService } from '../alumnus.service';
import { ParamMap } from '@angular/router';
import { mimeType } from 'src/app/utils/mime-type.validator';

@Component({
  selector: 'app-alumni-create',
  templateUrl: './alumni-create.component.html',
  styleUrls: ['./alumni-create.component.css']
})
export class AlumniCreateComponent implements OnInit {
  enteredName = "";
  enteredProfession = "";
  enteredBio = "";
  alumnus: Alumnus;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private alumnusId: string;
  isLoading = false;

  constructor(
    public alumnusService: AlumnusService, 
    public route: ActivatedRoute
  ) { }

  ngOnInit() { 
    this.form = new FormGroup({
      name: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      profession: new FormControl(null, 
        {validators: [Validators.required]
      }),
      bio: new FormControl(null, 
        {validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    }); 

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('alumnusId')) {
        this.mode = 'edit';
        this.alumnusId = paramMap.get('alumnusId');
        this.isLoading = true;
        this.alumnusService.getAlumnus(this.alumnusId).subscribe(alumnusData => {
          this.isLoading = false;
          this.alumnus = {
            id: alumnusData._id,
            name: alumnusData.name,
            profession: alumnusData.profession,
            bio: alumnusData.bio,
            imagePath: alumnusData.imagePath
          };
          this.form.setValue({
            name : this.alumnus.name,
            profession : this.alumnus.profession,
            bio : this.alumnus.bio
          });
        });
      } else {
        this.mode = 'create';
        this.alumnusId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      console.log(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  onSaveAlumnus() { 
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.alumnusService.addAlumni(
        this.form.value.name,
        this.form.value.profession, 
        this.form.value.bio,
        this.form.value.image
      );
    } else {
      this.alumnusService.updateAlumnus(
        this.alumnusId, 
        this.form.value.name,
        this.form.value.profession, 
        this.form.value.bio,
        this.form.value.image
      );
    }
    this.form.reset();
  }

}
