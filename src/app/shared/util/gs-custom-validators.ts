import { AbstractControl } from "@angular/forms";

export class GSCustomValidators {
	static lowerCaseRequired(formField: AbstractControl): any {
		const LOWER_LETTERS_REGEX = /[a-z]+/;
		if (LOWER_LETTERS_REGEX.test(formField.value) && formField.value != null) {
			return null;
		}
		return {
			lowerCaseRequired: true
		};
	}

	static upperCaseRequired(formField: AbstractControl): any {
		const UPPER_LETTERS_REGEX = /[A-Z]+/;
		if (UPPER_LETTERS_REGEX.test(formField.value)) {
			return null;
		}
		return {
			upperCaseRequired: true
		};
	}

	static upperLowerRequired(formField: AbstractControl): any {
		const UPPER_LETTERS_REGEX = /[A-Z]+/;
		const LOWER_LETTERS_REGEX = /[a-z]+/;
		if (UPPER_LETTERS_REGEX.test(formField.value) && LOWER_LETTERS_REGEX.test(formField.value)) {
			return null;
		}
		return {
			upperLowerRequired: true
		};
	}

	static numberRequired(formField: AbstractControl): any {
		const NUMBER_REGEX = /[0-9]+/;
		if (NUMBER_REGEX.test(formField.value)) {
			return null;
		}
		return {
			numberRequired: true
		};
	}

	static symbolRequired(formField: AbstractControl): any {
		const SYMBOL_REGEX = /[^A-Za-z0-9]+/;
		if (SYMBOL_REGEX.test(formField.value)) {
			return null;
		}
		return {
			symbolRequired: true
		};
	}

	static noRepeats(formField: AbstractControl): any {
		if (!formField.dirty) {
			return {
				repeatFound: true
			};
		}
		const REPEAT_REGEX = /([a-zA-Z0-9@#$%^&+=])\1{2,}/;
		if (!REPEAT_REGEX.test(formField.value)) {
			return null;
		}
		return {
			repeatFound: true
		};
	}

	static noSpaces(formField: AbstractControl): any {
		if (!formField.dirty) {
			return {
				spaceFound: true
			};
		}
		const SPACES_REGEX = /^\S+(?: \S+)*$/;
		if (SPACES_REGEX.test(formField.value)) {
			return null;
		}
		return {
			spaceFound: true
		};
	}

	static minLength(formField: AbstractControl): any {
		if (formField.value != null && formField.value != '' && formField.value.length >= 8) {
			return null;
		}
		return {
			minLength: true
		};
	}

	static email(formField: AbstractControl): any {
		if (formField.pristine) {
			return null;
		}
		const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		formField.markAsTouched();
		if (!EMAIL_REGEX.test(formField.value)) {
			return null;
		}
		return {
			invalidEmail: true
		};
	}
}
