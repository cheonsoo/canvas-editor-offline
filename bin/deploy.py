import os
import sys
import datetime
import yaml

env = sys.argv[1]
print(env)

script_path = os.path.dirname(os.path.realpath(__file__))
with open(f"{script_path}/config.{env}.yml", "r") as ymlfile:
    config = yaml.load(ymlfile)

now = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
app_name = config["app"]["name"]
app_root = config["app"]["root"]
s3_static = config["s3"]["bucket"]["static"]
s3_path = config["s3"]["bucket"]["path"]

print(f"now: {now}")
print(f"app_root: {app_root}")
print(f"s3_static: {s3_static}")

print(f"[STARTED] Starting deployment at {now}")

print("====================================================================================================")
print(f"Building {app_name}")
print("====================================================================================================")
os.system("PUBLIC_URL='.' yarn build")

print("====================================================================================================")
print(f"Backing up previous version to {s3_static}/{s3_path}/bak/{now}")
print("====================================================================================================")
os.system(
    f"aws s3 mv --recursive {s3_static}/{s3_path}/{app_name} {s3_static}/{s3_path}/bak/{now}/{app_name}")

print("====================================================================================================")
print(
    f"Deploying new version from {app_root}/build to {s3_static}/{s3_path}/{app_name}")
print("====================================================================================================")
os.system(f"aws s3 sync {app_root}/build/ {s3_static}/{s3_path}/{app_name}")

end = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
# print(f"Admin UI has beed deployed to https://s3.ap-northeast-2.amazonaws.com/test-pddetail-admin.lotteon.com/pilot/canvas-editor-offline/index.html")
# print(f"Admin UI has beed deployed to https://s3.ap-northeast-2.amazonaws.com/test-pddetail-admin.lotteon.com/pilot/canvas-editor-offline/index.html")
print(f"[FINISHED] Deployment Finished at {end}")
