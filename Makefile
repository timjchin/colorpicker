upload:
	gulp deploy; aws s3 sync ./static s3://www.rgba.space --region us-east-1 --acl public-read

