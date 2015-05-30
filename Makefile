upload:
	gulp build; aws s3 sync ./static s3://www.rgba.space --profile tim --region us-east-1 --acl public-read

