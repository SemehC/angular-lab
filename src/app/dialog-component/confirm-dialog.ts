import { Component } from '@angular/core';
@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialog {
  title = 'Are you sure ?';
  message = "This action can't be reverted";
  cancel = 'Cancel';
  confirm = 'Remove';
}
