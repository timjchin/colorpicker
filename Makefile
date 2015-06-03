upload:
	gulp deploy; 
	aws s3 sync ./static s3://www.rgba.space/ --region us-east-1 --acl public-read --exclude="*.js" --exclude="*x.css"
	aws s3 sync ./static s3://www.rgba.space/ --region us-east-1 --acl public-read --content-encoding="gzip" --include="*.js" --include="*x.css"

